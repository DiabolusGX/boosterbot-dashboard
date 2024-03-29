import React from "react";
import { useSelector } from "react-redux";

import { getAllUserGuilds, getAllBotGuildIds } from "../../api/index.js";

import Navbar from "../../components/Navbar/Navbar";
import Guild from "../../components/Guild/Guild";

import "./ServerPicker.scss";

const ServerPicker = () => {
    const username = useSelector((state) => state.user.username);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [manageableGuilds, setManageableGuilds] = React.useState([]);
    const [invitableGuilds, setInvitableGuilds] = React.useState([]);

    // if not logged in, redirect to home
    if (!isAuthenticated) {
        window.location.href = "/";
    }

    // returns common guilds with manage permissions
    const getManageableGuilds = (userGuilds, botGuilds) =>
        userGuilds.filter(
            (guild) =>
                (guild.owner || (guild.permissions & 0x20) === 0x20) &&
                botGuilds.includes(guild.id)
        );

    // returns guilds that the user can invite bot to
    const getInvitableGuilds = (userGuilds, botGuilds) =>
        userGuilds.filter(
            (guild) =>
                (guild.owner || (guild.permissions & 0x20) === 0x20) &&
                !botGuilds.includes(guild.id)
        );

    React.useEffect(() => {
        getAllBotGuildIds()
            .then((response) => {
                getAllUserGuilds().then((res) => {
                    // get common guilds with manage permission
                    setManageableGuilds(
                        getManageableGuilds(
                            res.data.guilds,
                            response.data.guildIds
                        )
                    );
                    // get guilds that the user can invite bot to
                    setInvitableGuilds(
                        getInvitableGuilds(
                            res.data.guilds,
                            response.data.guildIds
                        )
                    );
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Navbar />

            <div className="server-picker">
                <div className="server-picker-container">
                    <div className="server-picker-header">
                        <h1>• Booster Bot Dashboard</h1>
                    </div>
                    <div className="server-picker-heading">
                        <p>
                            Hello, {username}! Please select a server to get
                            started
                        </p>
                    </div>

                    <div className="server-picker-guilds">
                        {manageableGuilds.map((guild) => (
                            <Guild
                                key={guild.id}
                                guild={guild}
                                manageable={true}
                            />
                        ))}
                    </div>

                    {invitableGuilds.length > 0 && (
                        <p className="invitable">
                            You can invite Booster Bot to following servers:
                        </p>
                    )}
                    <div className="server-picker-guilds">
                        {invitableGuilds.map((guild) => (
                            <Guild
                                key={guild.id}
                                guild={guild}
                                invitable={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServerPicker;
