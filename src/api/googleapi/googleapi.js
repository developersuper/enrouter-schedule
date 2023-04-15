const addressValidator = async (address) => {
  const result = await fetch(
    `https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyDMzTIKp8wHo0drotbi0m_BEUqu9arnAZE`,
    {
      method: "POST",
      body: JSON.stringify(address),
    }
  );
};
export default {
  addressValidator,
};
