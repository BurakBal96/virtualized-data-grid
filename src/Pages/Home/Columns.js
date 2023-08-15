import { CustomCell } from "./CustomCell";

export const COLUMNS = [
  {
    label: "Custom Cell",
    field: "customCell", //pseudo field for key
    width: 15,
    CustomCell: CustomCell,
  },
  {
    label: "Username",
    field: "username",
    width: 25,
  },
  {
    label: "Email",
    field: "email",
    width: 25,
  },
  {
    label: "Birth Date",
    field: "birthdate",
    width: 20,
    type: "date",
  },
  {
    label: "Registered At",
    field: "registeredAt",
    width: 20,
    type: "date",

  },
];
