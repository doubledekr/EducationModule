import MainLayout from "@/layouts/MainLayout";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const handleResetProgress = () => {
    // This would normally have a confirmation dialog in a real app
    localStorage.clear();
    toast({
      title: "Progress Reset",
      description: "All progress has been reset. Reloading the app...",
    });
    
    // Reload the app
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-nunito font-bold text-2xl text-neutral-800 mb-1">
          Your Profile
        </h1>
        <p className="text-neutral-500">
          Manage your account and preferences
        </p>
      </div>
      
      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="material-icons text-primary text-2xl">person</span>
          </div>
          <div>
            <h2 className="font-nunito font-bold text-xl text-neutral-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-neutral-500">{user.email}</p>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-primary font-medium">Level {Math.floor(user.xp / 100) + 1}</span>
              <span className="mx-2">•</span>
              <span className="text-neutral-600">{user.xp} XP</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
          Account Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 border-b border-neutral-100">
            <div>
              <h3 className="font-medium text-neutral-800">Username</h3>
              <p className="text-sm text-neutral-500">{user.username}</p>
            </div>
            <button className="text-primary text-sm font-medium">Edit</button>
          </div>
          
          <div className="flex items-center justify-between p-2 border-b border-neutral-100">
            <div>
              <h3 className="font-medium text-neutral-800">Email</h3>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
            <button className="text-primary text-sm font-medium">Edit</button>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="font-medium text-neutral-800">Password</h3>
              <p className="text-sm text-neutral-500">********</p>
            </div>
            <button className="text-primary text-sm font-medium">Change</button>
          </div>
        </div>
      </div>
      
      {/* Preferences Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">
          Preferences
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 border-b border-neutral-100">
            <div>
              <h3 className="font-medium text-neutral-800">Notifications</h3>
              <p className="text-sm text-neutral-500">Receive reminders and updates</p>
            </div>
            <div className="relative inline-block w-10 h-6 rounded-full bg-primary">
              <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="font-medium text-neutral-800">Daily Goals</h3>
              <p className="text-sm text-neutral-500">Number of lessons per day</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="material-icons text-neutral-600 text-sm">remove</span>
              </button>
              <span className="font-medium">2</span>
              <button className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="material-icons text-neutral-600 text-sm">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="space-y-3">
        <button 
          className="w-full p-3 bg-white rounded-xl shadow-sm text-primary font-medium flex items-center justify-center"
          onClick={() => setLocation("/")}
        >
          <span className="material-icons mr-2">home</span>
          Back to Home
        </button>
        
        <button 
          className="w-full p-3 bg-white rounded-xl shadow-sm text-error font-medium flex items-center justify-center"
          onClick={handleResetProgress}
        >
          <span className="material-icons mr-2">refresh</span>
          Reset Progress (Demo Only)
        </button>
      </div>
    </MainLayout>
  );
}
