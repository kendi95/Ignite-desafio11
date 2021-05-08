import { getRepository, Like, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const users = await this.repository
      .createQueryBuilder("games")
      .where("lower(games.title) LIKE lower(:title)", { title: `%${param}%` })
      .getMany(); // Complete usando query builder

    return users;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this
      .repository
      .query("SELECT COUNT(games.id) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where("games.id = :id", { id })
      .innerJoinAndSelect("games.users", "users")
      .getOne();

    return games?.users as User[];
  }
}
