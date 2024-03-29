import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { useGuildData } from "../../services/guild";

import Navbar from "../../components/Navbar/Navbar";

import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import General from "../../components/Dashboard/General/General";
import Setup from "../../components/Dashboard/Setup/Setup";
import Greet from "../../components/Dashboard/Greet/Greet";
import Soon from "../../components/Dashboard/Soon/Soon";

import "./Dashboard.scss";

const ServerPicker = () => {
    const history = useHistory();

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [activeTab, setActiveTab] = useState("");
    const [guildAvailable, setguildAvailable] = useState(
        useSelector((state) => state.guild.available)
    );

    // if not logged in, redirect to home
    if (!isAuthenticated) {
        window.location.href = "/";
    }

    useEffect(() => {
        setActiveTab(history.location.pathname.split("/")[3]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fetch guild if guild is not available
    const guildData = useGuildData();
    if (!guildAvailable) {
        setguildAvailable(true);
        guildData(history.location.pathname.split("/")[2]);
    }

    return (
        <>
            <Navbar />

            <div className="dashboard">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="dashboard-content">
                    {activeTab === "general" && <General />}
                    {activeTab === "setup" && <Setup />}
                    {activeTab === "greet" && (
                        <Greet setActiveTab={setActiveTab} />
                    )}
                    {activeTab === "logging" && <Soon />}
                    {activeTab === "stats" && <Soon />}
                    {activeTab === "vars" && <Soon />}
                </div>
            </div>
        </>
    );
};

export default ServerPicker;
