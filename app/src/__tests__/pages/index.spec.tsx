import { screen, render, fireEvent } from "@testing-library/react";
import { getProvidersWrapper } from "../lib/utils/getProviders";

import router from "next/router";
import mockRouter from "next-router-mock";

import Login from "../../pages";

let wrapper;

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("🏠 Should be able to render the login page:", () => {
  beforeEach(() => {
    wrapper = getProvidersWrapper();
    mockRouter.setCurrentUrl("/");
  });

  it("Should be able to render the page;", async() => {
    render(<Login/>, { wrapper });

    expect(router).toMatchObject({
      asPath: "/"
    });

    const layout = await screen.findByTestId("layout");
    const logo = await screen.findByTestId("logo");
    const description = await screen.findByTestId("app-description");
    const buttons = await screen.findAllByTestId("button");
    
    //Should be in the document
    expect(layout).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();

    //Should have content
    expect(description.children).toBeDefined();

    //Should be able to have the correctly text content
    expect(buttons[0]).toHaveTextContent("Sign-in");
    expect(buttons[1]).toHaveTextContent("Documentation");
  });

  it("Should be able to request login.", async() => {
    render(<Login/>, { wrapper });

    //Default path
    expect(router).toMatchObject({
      asPath: "/"
    });

    const buttons = await screen.findAllByTestId("button");
    
    //Should be in the document
    expect(buttons[0]).toBeInTheDocument();

    //Should request login on click
    fireEvent.click(buttons[0]);
    expect(router).toMatchObject({
      asPath: "/api/login"
    });
  });
});