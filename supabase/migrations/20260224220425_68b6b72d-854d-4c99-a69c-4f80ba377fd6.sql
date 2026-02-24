
-- Role enum
CREATE TYPE public.app_role AS ENUM ('doctor', 'patient');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Patient profiles
CREATE TABLE public.patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  blood_type TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can read own profile" ON public.patient_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can update own profile" ON public.patient_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert own profile" ON public.patient_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Doctor profiles
CREATE TABLE public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL DEFAULT 'General',
  department TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  license_number TEXT,
  years_experience INT DEFAULT 0,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read doctor profiles" ON public.doctor_profiles FOR SELECT USING (true);
CREATE POLICY "Doctors can update own profile" ON public.doctor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Patient QR codes
CREATE TABLE public.patient_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can manage own QR" ON public.patient_qr_codes FOR ALL USING (
  patient_id IN (SELECT id FROM public.patient_profiles WHERE user_id = auth.uid())
);

-- Medical records
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctor_profiles(id),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  doctor_name TEXT,
  department TEXT,
  diagnosis TEXT,
  medications TEXT,
  lab_results TEXT,
  radiology TEXT,
  surgeries TEXT,
  allergies TEXT,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can read own records" ON public.medical_records FOR SELECT USING (
  patient_id IN (SELECT id FROM public.patient_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Doctors can read all records" ON public.medical_records FOR SELECT USING (
  public.has_role(auth.uid(), 'doctor')
);
CREATE POLICY "Doctors can insert records" ON public.medical_records FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'doctor')
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  patient_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can read own appointments" ON public.appointments FOR SELECT USING (
  patient_id IN (SELECT id FROM public.patient_profiles WHERE user_id = auth.uid())
  OR patient_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Doctors can read own appointments" ON public.appointments FOR SELECT USING (
  doctor_id IN (SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Doctors can update own appointments" ON public.appointments FOR UPDATE USING (
  doctor_id IN (SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid())
);

-- AI diagnoses
CREATE TABLE public.ai_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  diagnosis_title TEXT NOT NULL,
  confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  recommendation TEXT,
  details TEXT,
  severity TEXT DEFAULT 'unknown' CHECK (severity IN ('normal','mild','moderate','severe','unknown')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own diagnoses" ON public.ai_diagnoses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diagnoses" ON public.ai_diagnoses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON public.patient_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctor_profiles_updated_at BEFORE UPDATE ON public.doctor_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign patient role on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'patient');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
