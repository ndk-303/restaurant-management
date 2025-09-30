import { MenuItem } from 'src/modules/menu.items/entities/menu.item.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MenuItemOptionDocument = HydratedDocument<MenuItemOption>;

@Schema({ timestamps: true })
export class MenuItemOption {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
    menuItem: mongoose.Schema.Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    additionalPrice: number;

    @Prop()
    optionalDescription: string;

}

export const MenuItemOptionSchema = SchemaFactory.createForClass(MenuItemOption);
