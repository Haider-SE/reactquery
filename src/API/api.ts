const fetchUsers = async () => {
  // Using fetch to retrieve data from an endpoint and parsing it as JSON
  const response = fetch("https://dummyjson.com/users").then((res) => {
    return res.json();
  });
  return response;
};

const updateUser = async (data: any) => {
  const response = fetch(`https://dummyjson.com/users/${data.userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
  return response;
};
export { fetchUsers, updateUser };
