import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '../api/axios';
import {
  getTicketsRequest,
  getTicketRequest,
  createTicketRequest,
  updateTicketRequest,
  addCommentRequest,
  getStatusesRequest,
  getPrioritiesRequest,
} from '../api/ticketsApi';
import { getUsersRequest } from '../api/usersApi';
import { logout } from './authSlice';

// Wraps an API call so a failure becomes a readable error message
const thunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

export const fetchTickets = thunk('tickets/fetchAll', () => getTicketsRequest());
export const fetchTicket = thunk('tickets/fetchOne', (id) => getTicketRequest(id));
export const createTicket = thunk('tickets/create', (ticket) => createTicketRequest(ticket));
export const updateTicket = thunk('tickets/update', ({ id, changes }) =>
  updateTicketRequest(id, changes)
);
export const addComment = thunk('tickets/addComment', ({ ticketId, content }) =>
  addCommentRequest(ticketId, content)
);
// Statuses and priorities for selects and for showing names
export const fetchLookups = thunk('tickets/fetchLookups', async () => {
  const [statuses, priorities] = await Promise.all([getStatusesRequest(), getPrioritiesRequest()]);
  return { statuses, priorities };
});
// Admin only - agents list for assigning tickets
export const fetchAgents = thunk('tickets/fetchAgents', async () => {
  const users = await getUsersRequest();
  return users.filter((user) => user.role === 'agent');
});

const initialState = {
  // list page
  items: [],
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,

  // single ticket page (includes comments)
  current: null,
  currentStatus: 'idle',
  currentError: null,

  // create / update / comment actions
  actionStatus: 'idle',
  actionError: null,

  statuses: [],
  priorities: [],
  agents: [],
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchTickets.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload;
      })

      // single ticket
      .addCase(fetchTicket.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = null;
        state.current = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.payload;
      })

      // create
      .addCase(createTicket.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.unshift(action.payload);
      })

      // update (status / assignment) - keep comments, the server returns the ticket without them
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const updated = action.payload;
        if (state.current?.id === updated.id) {
          state.current = { ...updated, comments: state.current.comments };
        }
        const index = state.items.findIndex((t) => t.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })

      // comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        if (state.current) {
          state.current.comments = [...(state.current.comments || []), action.payload];
        }
      })

      .addCase(fetchLookups.fulfilled, (state, action) => {
        state.statuses = action.payload.statuses;
        state.priorities = action.payload.priorities;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agents = action.payload;
      })

      // Clear all ticket data when the user logs out
      .addCase(logout, () => initialState)

      // shared pending / rejected for create, update and comment
      .addMatcher(
        (action) =>
          [createTicket.pending.type, updateTicket.pending.type, addComment.pending.type].includes(
            action.type
          ),
        (state) => {
          state.actionStatus = 'loading';
          state.actionError = null;
        }
      )
      .addMatcher(
        (action) =>
          [createTicket.rejected.type, updateTicket.rejected.type, addComment.rejected.type].includes(
            action.type
          ),
        (state, action) => {
          state.actionStatus = 'failed';
          state.actionError = action.payload;
        }
      );
  },
});

export const { clearActionError } = ticketsSlice.actions;

export default ticketsSlice.reducer;
