import { Request, Response, NextFunction } from "express";
import { ValidationError, ValidationErrorItem } from "joi";
import { HttpError as MyHttpError } from "http-errors";

export const customMessages = {
  "string.base": "{#label} deve ser uma string",
  "string.empty": "{#label} não pode estar vazio",
  "string.email": "E-mail inválido.",
  "string.regex.base": "{#label} não está no formato correto",
  "string.min": "{#label} deve ter pelo menos {#limit} caracteres",
  "string.max": "{#label} deve ter no máximo {#limit} caracteres",
  "any.required": "{#label} é um campo obrigatório",
  "string.allow": "{#label} não é permitido",
  "string.uri": "{#label} deve ser uma URL válida",
  "string.case": "{#label} deve estar em maiúsculas/minúsculas",

  // Numeric validation errors
  "number.base": "{#label} deve ser um número",
  "number.min": "{#label} deve ser no mínimo {#limit}",
  "number.max": "{#label} deve ser no máximo {#limit}",
  "number.integer": "{#label} deve ser um número inteiro",
  "number.positive": "{#label} deve ser um número positivo",
  "number.negative": "{#label} deve ser um número negativo",

  // Date validation errors
  "date.base": "{#label} deve ser uma data válida",
  "date.format": "{#label} não está no formato correto",

  // Array validation errors
  "array.base": "{#label} deve ser um array",
  "array.min": "{#label} deve ter no mínimo {#limit} itens",
  "array.max": "{#label} deve ter no máximo {#limit} itens",
  "array.unique": "Os itens em {#label} devem ser únicos",

  // Object validation errors
  "object.base": "{#label} deve ser um objeto",
  "object.unknown": "{#label} contém chaves desconhecidas: {#unknown}",

  // any
  "any.cpf": "CPF ou CNPJ inválido.",
  "any.invalid": "{#label} não é permitido",
  "any.unknown": "{#label} não é esperado"
};

export function celebrateErrorHandler(err: ValidationError, req: Request, res: Response, next: NextFunction){
  const errorDetails: ValidationErrorItem[] = err.details;
  const errors: { [key: string]: string } = {};
  errorDetails.forEach((error) => {
    const key = "unknown";
    const message = error.message;
    errors[key] = message;
  });
  const message = errors.unknown || "Dados inválidos.";
  const status = 404;
  const success = false;
  res.status(status).json({ success, message, status });
}

export function errorHandler(err: MyHttpError, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.customMessage || err.message || "Internal Server Error";
  const success = false;
  res.status(status).json({ success, message, status });
}
  
export class CustomError extends Error {
  status: number;
  message: string;

  constructor(message: string, statusCode: number, customMessage?: string) {
    customMessage = customMessage || message;
    super(message);
    this.status = statusCode;
    this.message = customMessage;
  }
}