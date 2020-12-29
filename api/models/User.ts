import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 256, unique: true })
  email!: string;

  @Column({ length: 1024 })
  password!: string;

  @Field()
  @Column({ length: 256 })
  firstName!: string;

  @Field()
  @Column({ length: 256 })
  lastName!: string;
}

export default User;
