import React, { useState } from 'react'
import { getUserToken } from '../../../components_login/Tokens.js';
import { BASE_URL } from '../../requests/URL.js';

export default function AccountAction({ user, data }) {

    const [grant, setGrant] = useState();
    const [balance, setBalance] = useState();
    const [payment, setPayment] = useState();
    const [remarks, setRemarks] = useState();
    const [disable, setDisable] = useState(false);
    const [action, setAction] = useState("Take Action");

    const getGrant = (e) => {
        setGrant(e.target.value);
    }

    const getBalance = (e) => {
        setBalance(e.target.value);
    }

    const getPayment = (e) => {
        setPayment(e.target.value);
    }

    const getRemarks = (e) => {
        setRemarks(e.target.value);
    }

    function checks() {
        if (grant === null || balance === null || payment === null) {
            window.alert("Please fill the all Field..");
            return false;
        }
        else return true;
    }

    const handleDisapprove = (e) => {
        e.preventDefault();
        if (!disable) {
            setDisable(true);
            setAction("Rejecting")
            updateStatus("-3");
        }
    }

    const handleApprove = (e) => {
        e.preventDefault();

        if (!disable) {
            setDisable(true);
            setAction("Approving")
            updateStatus("3");
        }
    }

    const updateStatus = async (status) => {
        if (!checks()) {
            return;
        }
        const token = getUserToken();

        const res = await fetch(`${BASE_URL}/accountApproveOrDisapprove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id: data._id,
                status: status,
                balanceAvailable: balance,
                grantUtilized: grant,
                passedForPayment: payment,
                accountRemarks: remarks
            })
        })
        setAction("Please Refresh the page..");
    }


    return (
        <>
            <div className="overflow-hidden mt-2 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-2 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Take Action</h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Grant Utilized </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <input type="number" onChange={getGrant} placeholder="" className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-blue-400 bg-white px-5 py-2.5 text-gray-700 focus:border-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40 dark:border-red-400 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-red-300" />
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Balance Available</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <input type="number" onChange={getBalance} placeholder="" className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-blue-400 bg-white px-5 py-2.5 text-gray-700 focus:border-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40 dark:border-red-400 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-red-300" />
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Passed for payment of Rs.</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <input type="number" onChange={getPayment} placeholder="" className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-blue-400 bg-white px-5 py-2.5 text-gray-700 focus:border-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-40 dark:border-red-400 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-red-300" />
                            </dd>
                        </div>


                        <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                <textarea onChange={getRemarks} className="block  mt-2 w-auto  placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                            </dd>
                        </div>
                    </dl>
                </div >
            </div >

            <br />
            <div className="flex overflow-hidden items-center bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700">
                <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 gap-x-3 hover:bg-gray-100">
                    {action}
                </div>
                <button onClick={handleApprove} className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 gap-x-3 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <span>Approve</span>
                </button>

                <button onClick={handleDisapprove} className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 gap-x-3 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <span>DisApprove</span>
                </button>


            </div>
        </>
    )
}