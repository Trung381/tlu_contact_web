import React from "react";

import Table from "../components/Table";

const StaffPage = () => {
  const columns = [
    { key: "name", label: "Name" },
    { key: "country", label: "Country" },
    {
      key: "avatar",
      label: "Avatar",
      render: (value) => (
        <div className="avatar">
          <div className="mask mask-squircle w-12 h-12">
            <img src={value} alt="Avatar" />
          </div>
        </div>
      ),
    },
    { key: "company", label: "Company" },
    {
      key: "jobTitle",
      label: "Job Title",
      render: (value) => <span className="badge badge-ghost badge-sm">{value}</span>,
    },
    { key: "favoriteColor", label: "Favorite Color" },
  ];

  const data = [
    {
      name: "Hart Hagerty",
      country: "United States",
      avatar: "https://img.daisyui.com/images/profile/demo/2@94.webp",
      company: "Zemlak, Daniel and Leannon",
      jobTitle: "Desktop Support Technician",
      favoriteColor: "Purple",
    },
    {
      name: "Brice Swyre",
      country: "China",
      avatar: "https://img.daisyui.com/images/profile/demo/3@94.webp",
      company: "Carroll Group",
      jobTitle: "Tax Accountant",
      favoriteColor: "Red",
    },
    {
      name: "Marjy Ferencz",
      country: "Russia",
      avatar: "https://img.daisyui.com/images/profile/demo/4@94.webp",
      company: "Rowe-Schoen",
      jobTitle: "Office Assistant I",
      favoriteColor: "Crimson",
    },
    {
      name: "Yancy Tear",
      country: "Brazil",
      avatar: "https://img.daisyui.com/images/profile/demo/5@94.webp",
      company: "Wyman-Ledner",
      jobTitle: "Community Outreach Specialist",
      favoriteColor: "Indigo",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Table columns={columns} data={data} id="staff-table" />
    </div>
  );
};

export default StaffPage;