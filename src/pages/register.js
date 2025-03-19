"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Link from "next/link";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Invalid phone number").required("Phone is required"),
  age: yup.number().positive().integer().required("Age is required"),
  gender: yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  caste: yup.string().required("Caste is required"),
  maritalStatus: yup.string().required("Marital Status is required"),
  address: yup.string().required("Address is required"),
  bio: yup.string().max(500, "Bio should be under 500 characters"),
  profileImage: yup.mixed().required("Profile image is required"),
  houseImages: yup.array().min(1, "At least one house image is required"),
});

export default function MultiStepForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data) => console.log("Final Form Data:", data);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background.webp')" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-[#f3e5ab] shadow-2xl rounded-2xl w-full max-w-lg relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className="text-xl font-bold text-center mb-6">Step 1: Basic Info</h2>
                <input {...register("fullName")} placeholder="Full Name" className="input-field" />
                <p className="error-text">{errors.fullName?.message}</p>
  
                <input {...register("email")} placeholder="Email" className="input-field" />
                <p className="error-text">{errors.email?.message}</p>
  
                <input {...register("phone")} placeholder="Phone" className="input-field" />
                <p className="error-text">{errors.phone?.message}</p>
  
                <input {...register("age")} type="number" placeholder="Age" className="input-field" />
                <p className="error-text">{errors.age?.message}</p>
  
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
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className="text-xl font-bold text-center mb-6">Step 2: Additional Info</h2>
                <input {...register("caste")} placeholder="Caste" className="input-field" />
                <p className="error-text">{errors.caste?.message}</p>
  
                <input {...register("maritalStatus")} placeholder="Marital Status" className="input-field" />
                <p className="error-text">{errors.maritalStatus?.message}</p>
  
                <textarea {...register("address")} placeholder="Address" className="input-field"></textarea>
                <p className="error-text">{errors.address?.message}</p>
  
                <textarea {...register("bio")} placeholder="Bio (max 500 characters)" className="input-field"></textarea>
                <p className="error-text">{errors.bio?.message}</p>
              </motion.div>
            )}
  
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h2 className="text-xl font-bold text-center mb-6">Step 3: Upload Images</h2>
  
                <label className="block mb-2 font-semibold">Upload Profile Picture</label>
                <input 
                  {...register("profileImage")} 
                  type="file" 
                  className="input-field"
                  accept="image/*"
                />
                {errors.profileImage && <p className="error-text">{errors.profileImage.message}</p>}
  
                <label className="block mt-4 mb-2 font-semibold">Upload House Photos</label>
                <input 
                  {...register("houseImages")} 
                  type="file" 
                  multiple 
                  className="input-field"
                  accept="image/*"
                />
                {errors.houseImages && <p className="error-text">{errors.houseImages.message}</p>}
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
              <motion.button 
                type="submit" 
                className="submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
          .nav-btn, .submit-btn {
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
          .nav-btn:hover, .submit-btn:hover {
            background-color: #8b0000;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
