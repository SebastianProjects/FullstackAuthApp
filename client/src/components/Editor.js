import { useEffect } from "react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import './Editor.css'

function Editor() {
    const { theme, setTheme } = useTheme('')

    useEffect(() => {
        const savedTheme = sessionStorage.getItem("theme") || "palette-1";
        setTheme(savedTheme);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const changeTheme = (newTheme) => {
        console.log(newTheme);
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        sessionStorage.setItem("theme", newTheme);
    };

    return (
        <section className="editor-page">
            <h1 className="header-center">Editor</h1>
            <p className="left-p">Welcome to editor's page!</p>
            <label htmlFor="theme-selector" className="left-p">Choose Color Palette</label>
            <select
                id="theme-selector"
                className="classic-select"
                value={theme}
                onChange={(e) => changeTheme(e.target.value)}
            >
                <option value="palette-1">Pink-flow</option>
                <option value="palette-2">Navy</option>
                <option value="palette-3">Swamp</option>
                <option value="palette-4">Yellow</option>
            </select>

            <Link className="classic-link" to="/">Home</Link>
        </section>
    );
}

export default Editor;
