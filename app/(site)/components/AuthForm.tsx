"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Status } from "../types/FormStatus";
import AuthSocialButton from "@/app/components/AuthSocialButton";
import { BsGithub } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const toggleStatus = useCallback(() => {
    if (status === "LOGIN") {
      setStatus("REGISTER");
    } else {
      setStatus("LOGIN");
    }
  }, [status]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (status === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => {
          signIn("credentials", data);
        })
        .catch(() => {
          toast.error("Something went wrong! Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (status === "LOGIN") {
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          console.log(callback);
          if (callback?.error) {
            toast.error("Something went wrong. Please try again");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Logged in!");
          }
        })
        .finally(() => {
          router.push("/users");
          setIsLoading(false);
        });
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        console.log(callback);
        if (callback?.error) {
          toast.error("Something went wrong. Please try again");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Logged in!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full flex justify-center">
      <div className="bg-white px-4 py-8 shadow sm:rounded-l-lg sm:px-10 sm:max-w-xl sm:min-width-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mx-auto w-auto text-center text-2xl">Hello!</h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {status === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {status === "REGISTER" ? "Register" : "Log In"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center tet-sm mt-6 px-2 text-gray-500">
          <div>
            {status === "LOGIN"
              ? "First time here?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleStatus} className="underline cursor-pointer">
            {status === "LOGIN" ? "Create an account" : "Log In"}
          </div>
        </div>
      </div>
      <Image
        className="sm:rounded-r-lg"
        src="/logincover.png"
        alt="Login cover"
        width="512"
        height="512"
        priority={true}
        quality={75}
      />
    </div>
  );
};

export default AuthForm;
