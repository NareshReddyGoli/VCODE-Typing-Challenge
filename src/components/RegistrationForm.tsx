import React, { useState } from "react";
import type { StudentDetails } from "../types";

interface RegistrationFormProps {
  onSubmit: (details: StudentDetails) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StudentDetails>({
    name: "",
    registrationNumber: "",
    email: "",
    mobileNumber: "",
    year: "",
    section: "",
  });

  const [errors, setErrors] = useState<Partial<StudentDetails>>({});

  const yearSections: Record<string, string[]> = {
    "2nd Year": Array.from({ length: 22 }, (_, i) => (i + 1).toString()),
    "3rd Year": Array.from({ length: 19 }, (_, i) => (i + 1).toString()),
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentDetails> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.registrationNumber.trim())
      newErrors.registrationNumber = "Registration number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.section) newErrors.section = "Section is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof StudentDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleYearChange = (year: string) => {
    handleInputChange("year", year);
    handleInputChange("section", "");
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="card-vcode rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="gradient-text">VCODE</span> Typing Contest
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleInputChange("registrationNumber", e.target.value)
              }
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter registration number"
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-red-400">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) =>
                handleInputChange("mobileNumber", e.target.value)
              }
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 10-digit mobile number"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
            {errors.year && (
              <p className="mt-1 text-sm text-red-400">{errors.year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Section
            </label>
            <select
              value={formData.section}
              onChange={(e) => handleInputChange("section", e.target.value)}
              disabled={!formData.year}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Section</option>
              {formData.year &&
                yearSections[formData.year]?.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
            </select>
            {errors.section && (
              <p className="mt-1 text-sm text-red-400">{errors.section}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-gradient py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition-all duration-300 glow-primary"
          >
            Register & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
