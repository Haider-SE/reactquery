// This component uses the 'useMutation' hook to update a user's data.

import React from "react";
import { addUser } from "../API/api";
import { useMutation, useQueryClient } from "react-query";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};
const AddUserComponent = () => {
  const queryClient = useQueryClient();
  // Updating a user
  const { mutateAsync, isLoading, isError, error } = useMutation(addUser, {
    // Before the mutation is performed, this function is triggered
    onMutate: async (newUser: User) => {
      // Prevent refetches from happening while mutating to avoid overwriting optimistic update
      await queryClient.cancelQueries("users");

      // Snapshot the previous state before the mutation
      const previousUsers = queryClient.getQueryData<User[]>(["users"]) || [];

      // Optimistically add the new user to our local cache
      queryClient.setQueryData(["users"], [...previousUsers, newUser]);

      // Return a context object with the snapshot value
      return { previousUsers };
    },
    // If the mutation fails, rollback to the previous state using the context returned from onMutate
    onError: (err, newUser, context: any) => {
      queryClient.setQueryData(["users"], context.previousUsers);
    },
    // After mutation, success or fail, refetch the users' query
    onSettled: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);
  const [userData, setUserData] = React.useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const handleAddUser = async () => {
    try {
      await mutateAsync(userData);
      // No need to set "isOptimisticallyUpdated" here because it's already set
    } catch (err) {}
  };
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Add User</h2>
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userData.id}
        onChange={(e) =>
          setUserData({ ...userData, id: Number(e.target.value) })
        }
        type="number"
        placeholder="ID"
      />
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userData.firstName}
        onChange={(e) =>
          setUserData({ ...userData, firstName: e.target.value })
        }
        type="text"
        placeholder="First Name"
      />
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userData.lastName}
        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
        type="text"
        placeholder="Last Name"
      />
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        type="text"
        placeholder="Email"
      />
      <input
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
        value={userData.phoneNumber}
        onChange={(e) =>
          setUserData({ ...userData, phoneNumber: e.target.value })
        }
        type="text"
        placeholder="Phone Number"
      />
      <button
        onClick={handleAddUser}
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
        {"Add User"}
      </button>
      {isError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          An error occurred: {error?.toString()}
        </div>
      )}
      {!isError && (
        <div style={{ color: "green", marginTop: "10px" }}>
          User Added successfully!
        </div>
      )}
    </div>
  );
};

export default AddUserComponent;
