import { NotFoundException } from "@nestjs/common"
import { RadioUseCases } from "./radio.use-cases"

describe('RadioUseCase', () => {

    let usecase: RadioUseCases

    it('updateSongs: throw NotFoundExeption if radio is not in database', async () => {
        const mockRepository = {
            findById: jest.fn().mockReturnValue(undefined),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn()
        }
        usecase = new RadioUseCases(mockRepository)

        const updateSongs = {
            radioId: "A48BCD55-B248-4377-8BCD-E9687768BA07",
            songs: [{
                id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
                title: "runaway",
                album: "bonjovi",
                artist: "bonjovi",
                genre: "rock"
            }]
        }
        await expect(usecase.updateSongs(updateSongs)).rejects.toThrow(NotFoundException);

    })

    it('updateSongs: songs updated', async () => {
        const mockRepository = {
            findById: jest.fn().mockReturnValue({
                id: 'A48BCD55-B248-4377-8BCD-E9687768BA07',
                name: "rock radio",
                songs: []
            }),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn()
        }
        usecase = new RadioUseCases(mockRepository)

        const updateSongs = {
            radioId: "A48BCD55-B248-4377-8BCD-E9687768BA07",
            songs: [{
                id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
                title: "runaway",
                album: "bonjovi",
                artist: "bonjovi",
                genre: "rock"
            }]
        }
        await usecase.updateSongs(updateSongs)
        expect(mockRepository.update).toBeCalledTimes(1)
    })
})