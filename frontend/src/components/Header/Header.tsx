import React from "react";
import * as styles from "./Header.module.scss";
export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1>Codereview Test App</h1>
        </header>
    );
};
