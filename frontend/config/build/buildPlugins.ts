import { Configuration, ProgressPlugin } from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BuildOptions } from "./types/types";
export function buildPlugins(options: BuildOptions): Configuration["plugins"] {
    const { mode, paths } = options;
    const isDev = mode === "development";
    const isProd = !isDev;
    const plugins: Configuration["plugins"] = [
        new HtmlWebpackPlugin({
            template: paths.html,
        }),
    ];
    if (isDev) {
        plugins.push(new ProgressPlugin());
    }
    if (isProd) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css",
                chunkFilename: "css/[name].[contenthash:8].css",
            })
        );
    }
    return plugins;
}
