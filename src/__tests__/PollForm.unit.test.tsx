import { render, screen, fireEvent, act } from "@testing-library/react";
import PollForm from "../components/PollForm";
import { supabase } from "@/lib/supabaseClient";

// Mock the supabase client
jest.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({ data: { id: "mock-poll-id" }, error: null })
          ),
        })),
      })),
    })),
  },
}));

// Mock AuthContext so it doesn’t call supabase
jest.mock("../lib/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" }, // pretend the user is logged in
  }),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("PollForm", () => {
  it("should update the first option input correctly", () => {
    render(<PollForm />);

    const optionInputs = screen.getAllByPlaceholderText(/Option \d/);
    const firstOptionInput = optionInputs[0];

    fireEvent.change(firstOptionInput, { target: { value: "Test Option 1" } });

    expect(firstOptionInput).toHaveValue("Test Option 1");
  });

  it("should show an error if poll title is empty", async () => {
    render(<PollForm />);

    const createButton = screen.getByRole("button", { name: /create poll/i });
    fireEvent.click(createButton);

    expect(await screen.findByText(/Poll title and all options are required/i)).toBeInTheDocument();
  });

  it("should call supabase insert when form is valid", async () => {
    render(<PollForm />);

    fireEvent.change(screen.getByPlaceholderText(/What's your favorite programming language/i), {
      target: { value: "Best language?" },
    });

    const optionInputs = screen.getAllByPlaceholderText(/Option \d/);
    fireEvent.change(optionInputs[0], { target: { value: "JavaScript" } });
    fireEvent.change(optionInputs[1], { target: { value: "Python" } });

    const createButton = screen.getByRole("button", { name: /create poll/i });
    await act(async () => {
      fireEvent.click(createButton);
    });

    
    expect(supabase.from).toHaveBeenCalledWith("polls");
  });
});