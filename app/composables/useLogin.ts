type UseLogin = () => Promise<boolean>;

const useLogin: UseLogin = async () => {
  try {
    const { data, error } = await useFetch("/api/login", {
      method: "POST"
    });

    console.log("data:", data.value);

    if (error.value) {
      console.log("error:", error.value);
      return false;
    }

    return data.value?.status === 200;
  }
  catch {
    return false;
  }
};

export {
  useLogin
};
