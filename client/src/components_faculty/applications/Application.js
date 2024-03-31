import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  removeAppToken,
  setAppToken,
  getUserToken,
} from "../../components_login/Tokens";
import LoaderCard from "../../components/loading/LoaderCard";
import { Container } from "@mui/material";
import { BASE_URL } from "../../components/requests/URL";
import { FaSort } from "react-icons/fa";

const data = [];
const settlementData = [];

export default function FacultyApplication() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState(data);
  const [apps2, setApps2] = useState(data);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = [
    {
      label: "Time",
      content:
        "Applications are being displayed based on Time of the conference.",
    },
    {
      label: "Entry No.",
      content:
        "Applications are being displayed based on Entry No of the conference.",
    },
    {
      label: "Name",
      content:
        "Applications are being displayed based on Name of the conference.",
    },
  ];

  function handleTabClick(index) {
    setActiveTabIndex(index);
    if (index === 0) {
      apps.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } else if (index === 1) {
      apps.sort((a, b) => a.email.localeCompare(b.email));
    } else if (index === 2) {
      apps.sort((a, b) => a.nameOfConference.localeCompare(b.nameOfConference));
    }
  }

  const getAppInfo = async () => {
    try {
      const token = getUserToken();
      const resp = await fetch(`${BASE_URL}/viewFacultyApplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      const { data: data1, data2 } = data;
      console.log("data1", data1)
      setApps(data1);
      setApps2(data2);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppInfo()
      .then((resp) => {
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const getStatus = (code) => {
    switch (code) {
      case "0":
        return "Pending Faculty Approval";
      case "1":
        return "Pending Hod Section Approval";
      case "2":
        return "Pending Research Section Approval";
      case "3":
        return "Pending Account Section Approval";
      case "4":
        return "Pending Dean Approval";
      default:
        return "Application Approved";
    }
  };

  const getDays = (subDate) => {
    const today = new Date();
    const submitDate = new Date(subDate);
    const days = Math.floor((today - submitDate) / (1000 * 3600 * 24));
    if (days < 1) return "Submitted Recently";
    else if (days === 1) return "1 Day Ago";
    else return `${days} Days ago`;
  };

  const getFinances = (finance) => {
    let totalAmount = 0;
    finance.forEach((element) => {
      totalAmount += Number(element.amount);
    });
    return totalAmount;
  };

  const createAppToken = async (id) => {
    try {
      const aisehi = "abcd";
      const resp = await fetch(`${BASE_URL}/createApplicationToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, aisehi }),
      });
      const data = await resp.json();
      const appToken = data.appToken;
      setAppToken(appToken);
    } catch (error) {
      console.log(error);
    }
  };

  const viewSpecificApplication = async (e) => {
    e.preventDefault();
    const { name } = e.target;
    removeAppToken();
    try {
      await createAppToken(name);
      navigate("/facultyLogin/studentApplication");
    } catch (error) {
      console.log(error);
    }
  };

  const renderApps1 = apps && apps.map((item, index) => (
    <div
      key={index}
      className="rounded-lg bg-white text-center shadow-md p-4 mb-4"
    >
      <div className="border-b-2 border-gray-200 px-6 py-3">
        {getStatus(item.status)}
      </div>
      <div className="p-4">
        <h5 className="mb-2 text-xl font-medium text-gray-800">
          {item.nameOfConference}
        </h5>
        <p className="mb-1 text-base text-gray-600">
          Amount Needed: {getFinances(item.finances)} Rs
        </p>
        <p className="mb-1 text-base text-gray-600">
          Submitted By: {item.email}
        </p>
      </div>
      <button
        name={item._id}
        onClick={viewSpecificApplication}
        className="rounded-md bg-dark-purple hover:text-teal-400 hover:bg-button-hover-blue px-3 py-2 mb-2 text-sm font-semibold text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-dark-purple"
      >
        View Full Application
      </button>
      <div className="border-t-2 border-gray-200 px-6 py-3">
        {getDays(item.createdAt)} (
        {item.type === 0 ? "National" : "International"})
      </div>
    </div>
  ));

  const renderApps2 =
    apps2 &&
    apps2.map((item, index) => (
      <>
        <div key={index}>
          <div className="block max-w-md  rounded-lg  bg-white text-center shadow-lg dark:bg-neutral-700">
            <div className="border-b-2 border-neutral-100 px-6 py-3 dark:border-gray-600 dark:text-neutral-50">
              {getStatus(item.status)}
            </div>
            <div className="p-4">
              <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                Settlement form
              </h5>
              <p className="mb-1 text-base text-neutral-600 dark:text-neutral-200">
                Amount Needed: {getFinances(item.finances)} Rs
              </p>
              <p className="mb-1 text-base text-neutral-600 dark:text-neutral-200">
                Department: {item.department}
              </p>
            </div>
            <button
              name={item._id}
              onClick={viewSpecificApplication}
              className="rounded-md bg-dark-purple hover:text-teal-400 hober:bg-button-hover-blue px-3 py-2 mb-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-purple"
            >
              Vew Full Application
            </button>
            <div className="border-t-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
              {getDays(item.createdAt)}
            </div>
          </div>
        </div>

        <br />
      </>
    ));

  return (
    <>
      <br />
      {isLoading ? (
        <Container>
          <LoaderCard />
        </Container>
      ) : (
        <Container>
          {/* <div className="my-5  bg-white rounded-lg shadow-md overflow-hidden"> */}
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow-md">
            <span style={{ display: "flex", alignItems: "center" }}>
              <FaSort color="dark-purple" style={{ marginRight: "0.5rem" }} />
              <span className="text-lg font-medium">
                Sort Applications on the basis of:{" "}
              </span>
            </span>
            <div className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={tab.label}
                  className={`mx-2 py-1 px-4 rounded-lg font-medium e ${index === activeTabIndex
                      ? "bg-dark-purple text-white hover:text-teal-400 hover:bg-button-hover-blue"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  onClick={() => handleTabClick(index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-2"></div>
          {/* </div> */}
          <div className="flex font-bold text-3xl text-black-800 items-center justify-center">
            Application Forms
          </div>
          <div className="my-3 flex flex-wrap justify-center gap-4">
            {apps && renderApps1}
          </div>
          <div className="flex font-bold text-3xl text-black-800 items-center justify-center">
            Settlement Forms
          </div>
          <div className="my-3 flex flex-wrap justify-center gap-4">
            {apps2 && renderApps2}
          </div>
        </Container>
      )}
    </>
  );
}
