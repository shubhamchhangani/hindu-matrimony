import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import supabase from "../utils/supabase/client";

// Define your validation schema using Yup
const schema = Yup.object().shape({
  full_name: Yup.string().max(100, "Name too long").required("Please enter your full name"),
  date_of_birth: Yup.date().required("Please select your date of birth"),
  gender: Yup.string().oneOf(["Male", "Female", "Other"], "Invalid gender").required("Select your gender"),
  caste: Yup.string().max(100, "Caste too long"),
  mother_tongue: Yup.string().max(50, "Mother tongue too long").required("Please enter your mother tongue"),
  country: Yup.string().max(100, "Country name too long"),
  state: Yup.string().max(100, "State name too long"),
  city: Yup.string().max(100, "City name too long"),
  phone_number: Yup.string().max(20, "Phone number too long"),
  bio: Yup.string().max(500, "Bio too long"),
  marital_status: Yup.string().oneOf(["Single", "Divorced", "Widowed"], "Invalid marital status"),
  occupation: Yup.string().max(100, "Occupation too long").required("Please enter your occupation"),
  annual_income: Yup.number().min(0, "Invalid income").required("Enter your annual income"),
  height_cm: Yup.number().min(50, "Height too short").max(300, "Height too tall"),
  weight_kg: Yup.number().min(10, "Weight too low").max(500, "Weight too high"),
  diet: Yup.string().oneOf(["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"], "Invalid diet preference"),
  smoking_habit: Yup.boolean(),
  drinking_habit: Yup.boolean(),
});

const MultiStepForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  useEffect(() => {
    if (!uid) {
      router.push('/signup');
    }
  }, [uid, router]);

  // Debug: Log form errors whenever they change
  useEffect(() => {
    console.log("Current form errors:", errors);
  }, [errors]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Helper function to upload files to the "userphotos" bucket
  
  const onSubmit = async (data) => {
    console.log("onSubmit fired with data:", data);
    try {
      // Insert profile details into the "profiles" table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: uid, // Using the uid from URL
          full_name: data.full_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          caste: data.caste,
          mother_tongue: data.mother_tongue,
          country: data.country,
          state: data.state,
          city: data.city,
          phone_number: data.phone_number,
          bio: data.bio,
          marital_status: data.marital_status,
          occupation: data.occupation,
          annual_income: data.annual_income,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          diet: data.diet,
          smoking_habit: data.smoking_habit,
          drinking_habit: data.drinking_habit,
        },
      ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        alert("Error creating profile: " + profileError.message);
        return;
      }

      alert("Profile successfully created!");
      router.push(`/upload?uid=${uid}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/background.webp')" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-[#f3e5ab] shadow-2xl rounded-2xl w-full max-w-lg relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                <h2 className="text-xl font-bold text-center mb-6">Step 1: Basic Info</h2>
                <input {...register("full_name")} placeholder="Full Name" className="input-field" />
                <p className="error-text">{errors.full_name?.message}</p>
                <input {...register("phone_number")} placeholder="Phone" className="input-field" />
                <p className="error-text">{errors.phone_number?.message}</p>
                <input {...register("date_of_birth")} type="date" placeholder="Date of Birth" className="input-field" />
                <p className="error-text">{errors.date_of_birth?.message}</p>
                <select {...register("gender")} className="input-field">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="error-text">{errors.gender?.message}</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                <h2 className="text-xl font-bold text-center mb-6">Step 2: Additional Info</h2>
                <input {...register("caste")} placeholder="Caste" className="input-field" />
                <p className="error-text">{errors.caste?.message}</p>
                <input {...register("marital_status")} placeholder="Marital Status" className="input-field" />
                <p className="error-text">{errors.marital_status?.message}</p>
                <textarea {...register("address")} placeholder="Address" className="input-field"></textarea>
                <p className="error-text">{errors.address?.message}</p>
                <textarea {...register("bio")} placeholder="Bio (max 500 characters)" className="input-field"></textarea>
                <p className="error-text">{errors.bio?.message}</p>
              </motion.div>
            )}

            

            {step === 3 && (
              <motion.div key="step4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                <h2 className="text-xl font-bold text-center mb-6">Step 4: Professional Info</h2>
                <input {...register("occupation")} placeholder="Occupation" className="input-field" />
                <p className="error-text">{errors.occupation?.message}</p>
                <input {...register("annual_income")} type="number" placeholder="Annual Income" className="input-field" />
                <p className="error-text">{errors.annual_income?.message}</p>
                <input {...register("height_cm")} type="number" placeholder="Height (cm)" className="input-field" />
                <p className="error-text">{errors.height_cm?.message}</p>
                <input {...register("weight_kg")} type="number" placeholder="Weight (kg)" className="input-field" />
                <p className="error-text">{errors.weight_kg?.message}</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step5" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                <h2 className="text-xl font-bold text-center mb-6">Step 5: Lifestyle Info</h2>
                {/* New mother tongue input */}
    <input {...register("mother_tongue")} placeholder="Mother Tongue" className="input-field" />
    <p className="error-text">{errors.mother_tongue?.message}</p>
                <select {...register("diet")} className="input-field">
                  <option value="">Select Diet Preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
                <p className="error-text">{errors.diet?.message}</p>
                <label className="block mt-4 mb-2 font-semibold">Smoking Habit</label>
                <input {...register("smoking_habit")} type="checkbox" className="input-field" />
                <p className="error-text">{errors.smoking_habit?.message}</p>
                <label className="block mt-4 mb-2 font-semibold">Drinking Habit</label>
                <input {...register("drinking_habit")} type="checkbox" className="input-field" />
                <p className="error-text">{errors.drinking_habit?.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                className="nav-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back
              </motion.button>
            )}
            {step < totalSteps ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="nav-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            ) : (
              <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Submit
              </motion.button>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/login" className="nav-btn text-center">
              Already registered? Login
            </Link>
          </div>
        </form>
        <style jsx>{`
          .input-field {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 2px solid #b22222;
            border-radius: 8px;
            background-color: #f3e5ab;
            color: #b22222;
            transition: all 0.3s;
          }
          .input-field:focus {
            border-color: #8b0000;
            box-shadow: 0px 0px 8px rgba(178, 34, 34, 0.5);
          }
          .error-text {
            color: red;
            font-size: 12px;
          }
          .nav-btn,
          .submit-btn {
            flex: 1;
            padding: 12px;
            background-color: #b22222;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            margin: 0 5px;
          }
          .nav-btn:hover,
          .submit-btn:hover {
            background-color: #8b0000;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default MultiStepForm;