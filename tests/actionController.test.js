const noteController = require('../src/controllers/actionController');

describe('Note Controller', () => {
    it('should get notes', () => {
        // Mock any dependencies or data that the controller uses (e.g., a database)

        // Create mock request and response objects
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function
        noteController.getNotes(req, res);

        // Verify that the controller function behaves as expected
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Get notes success' });
    });
});
