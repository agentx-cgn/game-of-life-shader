// declare module '*.shader' {
//     const value: string
//     export default value
// }

declare module "*.shader?raw" {
    const content: string;
    export default content;
}