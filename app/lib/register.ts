import User from "../models/users";
import { db } from "./db";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./email";

export async function Register(formData: FormData) {
  await db();
  const errors: Record<string, string> = {};
  const firstName = formData.get("first-name")?.toString();
  const lastName = formData.get("last-name")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm-password")?.toString();
  const streetAddress = formData.get("street-address")?.toString();
  const city = formData.get("city")?.toString();
  const state = formData.get("state");
  const zipCode = formData.get("zip-code")?.toString();
  const country = formData.get("country")?.toString();

  const exists = await User.findOne({ email: email });
  if (exists) {
    errors.email = "Email already exists";
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = "First name is required";
  } else if (firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = "Last name is required";
  } else if (lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  if (!phone || phone.trim().length === 0) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone.trim())) {
    errors.phone = "Invalid phone number format (e.g., +1 212 555-0199)";
  }

  if (!email || email.trim().length === 0) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password || password.trim().length === 0) {
    errors.passsword = "Password is required";
  } else if (password.length < 10) {
    errors.password = "Password must be at least 10 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.password = "Password must contain at least one symbol (!@#$%^&*)";
  }

  if (!confirmPassword || confirmPassword.trim().length === 0) {
    errors.passsword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.password = "Passwords do not match";
  }

  if (!streetAddress || streetAddress.trim().length === 0) {
    errors.street = "Street address is required";
  } else if (streetAddress.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }

  if (!city || city.trim().length === 0) {
    errors.city = "City is required";
  } else if (city.trim().length < 2) {
    errors.city = "City name must be at least 2 characters";
  }

  const stateValue =
    typeof state === "string" ? state : state?.toString() || "";
  if (!stateValue || stateValue.trim().length === 0) {
    errors.state = "State is required";
  } else if (stateValue.trim().length < 2) {
    errors.state = "State must be at least 2 characters";
  }

  // if (!zipCode || zipCode.trim().length === 0) {
  //   return { error: "ZIP code is required", success: false };
  // } else if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
  //   return {
  //     error: "Invalid ZIP code format (e.g., 10001 or 10001-1234)",
  //     success: false,
  //   };
  // }

  if (!country || country.trim().length === 0) {
    errors.country = "Country is required";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  try {
    const hashedPassword = await bcrypt.hash(password!, 10);
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: hashedPassword,
      streetAddress: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    });

    const verificationToken = Jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" },
    );

    user.verificationToken = verificationToken;
    const save = await user.save();

    if (verificationToken && save) {
      const send = await sendVerificationEmail(email!, verificationToken);
      return { message: "Verification sent to email", success: true };
    }
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
