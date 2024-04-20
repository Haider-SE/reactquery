// This component uses the 'useMutation' hook to update a user's data.

import React from "react";
import { updateUser } from "../API/api";
import { useMutation, useQueryClient } from "react-query";

const UpdateUserComponent = () => {
  const queryClient = useQueryClient();
  // Updating a user
  const { mutateAsync, isLoading, isError, error } = useMutation(updateUser, {
    // Handle the optimistic update before calling the mutate function
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("users");

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData("users");

      // Optimistically update to the new value
      queryClient.setQueryData("users", (old: any) => ({
        ...old,
        users: old.users.map((user: any) =>
          user.id === newData.userId ? { ...user, ...newData } : user
        ),
      }));

      return { previousUsers };
    },
    // If the mutation fails, use the context returned from onMutate to rollback
    onError: (err, newData, context) => {
      queryClient.setQueryData("users", context?.previousUsers);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("users");
    },
  });
  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);
  const [userId, setUserId] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isOptimisticallyUpdated, setIsOptimisticallyUpdated] =
    React.useState(false);

  const handleUpdateUser = async () => {
    setIsOptimisticallyUpdated(true); // Assume the update will succeed

    try {
      const data = { userId, lastName };
      await mutateAsync(data);
      // No need to set "isOptimisticallyUpdated" here because it's already set
    } catch (err) {
      setIsOptimisticallyUpdated(false); // Update failed, reset the flag
    }
  };
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Update User</h2>
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        type="text"
        placeholder="User ID"
      />
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        placeholder="New Last Name"
      />
      <button
        onClick={handleUpdateUser}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {"Update User"}
      </button>
      {isError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          An error occurred: {error?.toString()}
        </div>
      )}
      {isOptimisticallyUpdated && !isError && (
        <div style={{ color: "green", marginTop: "10px" }}>
          User updated successfully!
        </div>
      )}
    </div>
  );
};

export default UpdateUserComponent;
