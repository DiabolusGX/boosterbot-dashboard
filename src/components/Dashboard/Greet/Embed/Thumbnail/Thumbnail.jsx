import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getUpdatedConfig } from "../../../../utilities/changeConfig";
import Radio from "../util/Radio";

import "../Embed.scss";

const typeMap = {
    t_disable: "Greet embed thumbnail image will be disabled.",
    t_user: "Bot will show booster's profile picture in thumbnail.",
    t_server: "Bot will show server's icon in thumbnail.",
    t_url: "You can set any custom image URL.",
};

const Thumbnail = ({
    toastId,
    updateConfig,
    disableButton,
    setDisableButton,
}) => {
    const greetConfig = useSelector((state) => state.guild.dbGreetConfig);

    const [iconType, setIconType] = React.useState(
        greetConfig?.thumbnail?.startsWith("http")
            ? "url"
            : greetConfig?.thumbnail
    );
    const [thumbnail, setThumbnail] = React.useState(
        greetConfig?.thumbnail || null
    );
    const [addImage, setAddImage] = React.useState(
        greetConfig?.thumbnail?.startsWith("http")
    );

    // Sync greet images
    React.useEffect(() => {
        setThumbnail(greetConfig?.thumbnail || null);
        let type = greetConfig?.thumbnail?.startsWith("http")
            ? "url"
            : greetConfig?.thumbnail;
        if (!type) type = "disable";
        setIconType(type);
        setAddImage(greetConfig?.thumbnail?.startsWith("http"));
    }, [greetConfig]);

    // handle thumbnail toggle
    const handleIconToggle = async () => {
        if (iconType === "disable") {
            setThumbnail("");
            setIconType("user");
        } else if (iconType !== "url") {
            setThumbnail("");
            setIconType("url");
            return;
        } else if (addImage) {
            setThumbnail("");
            setAddImage(false);
            return;
        } else {
            if (thumbnail === null || thumbnail === "") {
                toast.error("Please enter an image URL.");
                return;
            } else if (!thumbnail.startsWith("http")) {
                setThumbnail("");
                toast.error("Please enter a valid image URL.");
                return;
            }
            setAddImage(true);
        }
    };

    // handle thumbnail save
    const handleIconSave = () => {
        if (
            iconType === greetConfig?.thumbnail ||
            (iconType === "url" && thumbnail === greetConfig?.thumbnail) ||
            (iconType === "disable" && !greetConfig?.thumbnail)
        ) {
            return toast.warn(
                `Thumbnail is already '${thumbnail || "disabled"}'`
            );
        }
        if (iconType === "url" && thumbnail === "") {
            return toast.warn(`Thumbnail url can not be empty.`);
        }
        setDisableButton(true);
        toastId.current = toast.info(
            `${
                iconType === "disable" ? "Removing" : "Updating"
            } embed thumbnail.`,
            {
                autoClose: false,
            }
        );
        let icon = iconType === "disable" ? null : iconType;
        if (icon === "url") {
            icon = thumbnail;
        }
        updateConfig(
            getUpdatedConfig(greetConfig, {
                thumbnail: icon,
            }),
            `${iconType === "disable" ? "Removed" : "Updated"} embed thumbnail.`
        );
    };

    return (
        <>
            <div className="greet-std-container">
                <p className="greet-title">Embed Thumbnail</p>
                <div className="embed-thumbnail-wrapper">
                    <div className="greet-content">
                        <p>
                            {iconType === "disable" ? (
                                <>
                                    <b>Embed Thumbnail is disabled</b>
                                    <br />
                                    Bot will not add any thumbnail in the greet
                                    embded.
                                    <br />(<b>top right corner image</b>)
                                </>
                            ) : (
                                <>
                                    Select what image you want in greet embed
                                    thumbnail (<b>top right corner image</b>)
                                    field from given option down below.
                                </>
                            )}
                        </p>

                        <Radio
                            typeMap={typeMap}
                            prefix={"t_"}
                            iconType={iconType}
                            setIconType={setIconType}
                            icon={thumbnail}
                            setIcon={setThumbnail}
                            addImage={addImage}
                            setAddImage={setAddImage}
                            handleIconToggle={handleIconToggle}
                            handleIconSave={handleIconSave}
                            disableButton={disableButton}
                        />
                    </div>

                    {iconType === "url" && addImage && (
                        <img
                            className="embed-thumbnail"
                            src={thumbnail}
                            alt="greet"
                            onError={() => {
                                setAddImage(false);
                                setThumbnail("");
                                toast.error("Invalid image URL.");
                            }}
                            onLoad={() => {
                                setIconType("url");
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Thumbnail;
