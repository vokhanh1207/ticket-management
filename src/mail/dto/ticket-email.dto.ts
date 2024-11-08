import { Optional } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class TicketEmailDto {
    title: string;
    to: string[];
    content: string;
}