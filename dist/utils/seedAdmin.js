"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const prisma = new client_1.PrismaClient();
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = config_1.default.admin_email;
    const adminPassword = config_1.default.admin_password;
    const isAdminExists = yield prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (isAdminExists) {
        console.log("✔️ Admin credential already has been seeded.");
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
    yield prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
            needPasswordChange: false,
            admin: {
                create: {
                    name: "Portfolio Admin",
                    contactNumber: "00000000000",
                },
            },
        },
    });
    console.log("🎉 Admin credential has been seeded successfully.");
});
exports.seedAdmin = seedAdmin;
