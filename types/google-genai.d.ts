/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@google/genai" {
  // Minimal shims for the parts used in this project.
  export const Modality: any;
  export class GoogleGenAI {
    constructor(opts: { apiKey: string });
    models: {
      generateContent: (opts: any) => Promise<any>;
    };
  }
  export default GoogleGenAI;
}
