import coreJoi from 'joi';
import joiDate from '@joi/date';
import { Currency, ProductType } from './types';
const Joi = coreJoi.extend(joiDate) as typeof coreJoi;

const schema = Joi.object({
  productId: Joi.string(),
  productName: Joi.string().min(1).required(),
  productType: Joi.string()
    .valid(...Object.values(ProductType))
    .required(),
  quantity: Joi.number().integer().positive(),
  currency: Joi.string()
    .valid(...Object.values(Currency))
    .required(),
  orderedAt: Joi.date().format('YYYY-MM-DD hh:mm').required(),
  hasDiscount: Joi.boolean().required(),
  userId: Joi.string().guid().required(),
});

export default schema;
