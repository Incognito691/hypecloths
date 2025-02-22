import { protectedApi } from "@/lib/api";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import {
  useUpdateProfilePictureMutation,
  useUserProfileQuery,
} from "@/app/features/api/ProfileApi";
import { Loader } from "../ui/Loader";

const UserProfile: React.FC = () => {
  const { data: userProfileData, isLoading, error } = useUserProfileQuery();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateProfilePicture(formData).unwrap();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) {
    return <div className="text-red-500">Error loading profile</div>;
  }

  if (!userProfileData)
    return <div className="text-red-500">No profile data available</div>;

  const userProfile = userProfileData;

  const profilePictureSection = (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        {userProfile.displayPicture?.url ? (
          <Image
            src={userProfile.displayPicture.url}
            alt="Profile"
            width={350}
            height={400}
            className="w-[350px] h-[400px] rounded-full object-cover border-4 border-purple-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-3xl text-purple-500">
              {userProfile.firstName?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}

        <div className="mt-4 flex gap-2 justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="rounded-2xl 
               shadow-lg shadow-purple-500/20 backdrop-blur-lg border border-purple-600/30"
      >
        <h2
          className="text-3xl font-extrabold text-transparent bg-clip-text 
                 bg-gradient-to-r from-purple-400 to-indigo-300 mb-6 text-center mt-2"
        >
          My Profile
        </h2>
        {profilePictureSection}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div>
            <h3
              className="text-2xl font-bold text-purple-400 mb-4 
                     border-b-2 border-purple-600 pb-2"
            >
              Personal Information
            </h3>
            <p className="text-white text-lg mb-2 text-transform capitalize">
              Name: {userProfile.firstName} {userProfile.lastName}
            </p>
            <p className="text-gray-300 text-lg mb-2">
              Email: {userProfile.email}
            </p>
            <p className="text-indigo-300 text-lg">Role: {userProfile.role}</p>
          </div>
          <div>
            <h3
              className="text-2xl font-bold text-purple-400 mb-4
                     border-b-2 border-purple-600 pb-2"
            >
              Account Details
            </h3>
            <p className="text-white text-lg mb-2">
              User ID: {userProfile._id}
            </p>
            <p className="text-gray-300 text-lg mb-2">
              Created At: {new Date(userProfile.createdAt).toLocaleString()}
            </p>
            <p className="text-indigo-300 text-lg mb-2">
              Updated At: {new Date(userProfile.updatedAt).toLocaleString()}
            </p>
            <p className="text-indigo-300 text-lg">
              Status: <span className="text-green-500">Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
