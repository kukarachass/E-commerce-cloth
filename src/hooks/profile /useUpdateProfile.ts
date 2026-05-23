import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateProfileValues} from "@/lib/validators/update-profile-schema";
import {updateProfile} from "@/actions/profile/update-profile";
import {toast} from "sonner";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileValues) => updateProfile(data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile']})
            toast.success("Profile updated successfully.");
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong");
        }
    })
}