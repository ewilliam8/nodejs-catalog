import { Column, DataType, Model, Table, AutoIncrement } from 'sequelize-typescript';

@Table
export class profile_user extends Model {
 
  @Column({ type: DataType.STRING }) user_id: string;

  @Column({ type: DataType.STRING }) profile_id: string;

  @Column({ type: DataType.STRING }) direction_id: string;

  @Column({ type: DataType.DECIMAL }) priority: number;

}
