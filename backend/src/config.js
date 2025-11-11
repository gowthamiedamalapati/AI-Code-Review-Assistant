import 'dotenv/config';

const config = {
    PORT: process.env.PORT || 8080,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MODEL_CODE_REVIEW: process.env.MODEL_CODE_REVIEW,
    MAX_INPUT_BYTES: process.env.MAX_INPUT_BYTES || 100000
};

export { config };

console.log("Loaded config:", config);
