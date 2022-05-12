import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class direction_user extends Model {
 
  @Column({ type: DataType.DECIMAL }) user_id: number;

  @Column({ type: DataType.DECIMAL }) direction_id: number;

  @Column({ type: DataType.DECIMAL }) priority: number;

}
