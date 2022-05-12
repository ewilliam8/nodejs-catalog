import { Column, DataType, Model, Table, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table
export class users extends Model {

  @PrimaryKey
  @Column({ type: DataType.DECIMAL }) id: number;

  @Column({ type: DataType.STRING }) name: string;

}
