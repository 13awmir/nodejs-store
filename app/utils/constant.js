module.exports = {
  MONGODBID: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
  ROLES: {
    USER: "USER",
    ADMIN: "ADMIN",
  },
  ACCESS_TOKEN_SECRET_KEY:
    "99B491A8E1FDE8C49752D5AF7769C2412CA29BDCA594CED2FA588662E9EF38EE",
  REFRESH_TOKEN_SECRET_KEY:
    "6D74801D5F8F9817F527A106B6D9536BF95F2481B63993E7CD1B65531958DBB3",
};
