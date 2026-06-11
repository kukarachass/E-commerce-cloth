"use client"


import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateProfileValues} from "@/lib/validators/update-profile-schema";
import {updateProfile} from "@/actions/profile/update-profile";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {UpdateProfileCheckoutValues} from "@/lib/validators/update-profile-checkout-schema";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileCheckoutValues) => {
            const res = await updateProfile(data)

            if ('error' in res) {
                throw new Error("Failed to update profile")
            }

            return res.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success("Profile updated successfully.")
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong");
        }
    })
}