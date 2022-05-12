import { Column, DataType, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table
export class profile extends Model {
 
  @PrimaryKey
  @Column({ type: DataType.DECIMAL }) id: number;

  @Column({ type: DataType.STRING }) name: string;

  @Column({ type: DataType.DECIMAL }) direction_id: number;

}
