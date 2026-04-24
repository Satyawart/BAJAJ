import { validateInput } from '../services/validationService.js';
import { processGraph } from '../services/graphService.js';

const USER_ID = 'yourname_ddmmyyyy';
const EMAIL_ID = 'your_college_email';
const ROLL_NUMBER = 'your_roll_number';

export const handleBfhl = (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: '"data" must be an array' });
    }

    const { validEdges, invalid_entries, duplicate_edges } = validateInput(data);
    const { hierarchies, summary } = processGraph(validEdges);

    res.json({
      is_success: true,
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: ROLL_NUMBER,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary,
    });
  } catch (error) {
    res.status(500).json({ is_success: false, error: 'Something went wrong' });
  }
};
