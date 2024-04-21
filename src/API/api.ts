const fetchUsers = async () => {
  // Using fetch to retrieve data from an endpoint and parsing it as JSON
  const response = fetch("http://localhost:8000/users").then((res) => {
    return res.json();
  });
  return response;
};

const addUser = async (data: any) => {
  const response = fetch(`http://localhost:8000/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
  return response;
};
export { fetchUsers, addUser };
