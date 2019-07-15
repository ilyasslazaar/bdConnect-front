export const columns = [
  {
    name: "userName",
    label: "User"
  },
  {
    name: "method",
    label: "Action"
  },
  {
    name: "uriName",
    label: "Details",
    options: {
      customBodyRender: value => (value ? value.name : "")
    }
  },
  {
    name: "requestDate",
    label: "Date"
  },
  {
    name: "remote",
    label: "IP"
  }
];
export const options = {
  filterType: "checkbox",
  pagination: false,
  responsive: "scroll",
  filter: false,
  search: false,
  sort: false,
  selectableRows: false
};
