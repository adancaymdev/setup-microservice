"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSuccess = logSuccess;
exports.logInfo = logInfo;
exports.logError = logError;
const chalk_1 = __importDefault(require("chalk"));
function logSuccess(message) {
    console.log(chalk_1.default.green(`✅ ${message}`));
}
function logInfo(message) {
    console.log(chalk_1.default.blue(`ℹ️  ${message}`));
}
function logError(message) {
    console.log(chalk_1.default.red(`❌ ${message}`));
}
