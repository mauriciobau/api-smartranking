import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFound = await this.players.find(
      (player) => player.email === email,
    );

    if (playerFound) {
      return this.updatePlayer(playerFound, createPlayerDto);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const playerFound = await this.players.find(
      (player) => player.email === email,
    );

    if (!playerFound) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }

    return playerFound;
  }

  async deletePlayerByEmail(email: string): Promise<void> {
    const playerFound = await this.players.find(
      (player) => player.email === email,
    );

    if (!playerFound) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }

    this.players = this.players.filter(
      (player) => player.email !== playerFound.email,
    );
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      urlPhoto:
        'https://image.freepik.com/vetores-gratis/icone-de-avatar-de-personagem-de-homem-esporte-de-tenis_51635-2515.jpg',
    };
    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private updatePlayer(
    playerFound: Player,
    createPlayerDto: CreatePlayerDto,
  ): void {
    const { name } = createPlayerDto;

    playerFound.name = name;
  }
}
