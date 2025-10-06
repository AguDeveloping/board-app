*** Settings ***
Library    Browser
Library    Process
Library    OperatingSystem
Library    RequestsLibrary

*** Variables ***
# These will be loaded from .env file or use defaults
${FRONTEND_URL}      http://localhost:3001
${BACKEND_URL}       http://localhost:3000
${FRONTEND_PORT}     3001
${BACKEND_PORT}      3000
${TIMEOUT}           30s
${BROWSER_TYPE}      chromium

*** Tasks ***
Start React App And Open In Browser
    [Documentation]    Verifies backend is running and starts the frontend board application
    [Tags]    startup
    
    Log    Starting Board App automation setup...
    
    # Verify backend server (cards) is already running
    Verify Backend Server Is Running
    
    # Start the frontend development server (board)
    Start Frontend Development Server
    
    # Wait for the frontend application to be ready
    Wait For Frontend Application To Be Ready
    
    # Open browser and navigate to the frontend application
    Open Frontend Application In Browser
    
    # Verify the frontend application loaded successfully
    Verify Frontend Application Is Running

*** Keywords ***
Verify Backend Server Is Running
    [Documentation]    Verifies that the backend server (cards) is already running on port 3000
    Log    Checking if backend server is running on ${BACKEND_URL}...
    
    # Create a session for backend health check
    Create Session    backend_session    ${BACKEND_URL}    verify=False
    
    # Check if backend is responding
    ${status}=    Run Keyword And Return Status    
    ...    GET On Session    backend_session    /    expected_status=200
    
    Run Keyword If    ${status}    
    ...    Log    ✅ Backend server is running and ready on ${BACKEND_URL}
    ...    ELSE    
    ...    Fail    ❌ Backend server is not running on ${BACKEND_URL}. Please start the backend first.

Start Frontend Development Server
    [Documentation]    Starts the frontend dev server (board) in background
    Log    Starting frontend development server on port ${FRONTEND_PORT}...
    
    # Get the correct project root path (parent of robot folder)
    ${project_root}=    Normalize Path    ${CURDIR}${/}..
    Set Test Variable    ${PROJECT_ROOT}    ${project_root}
    Log    Project root directory: ${project_root}
    
    # Start the frontend development server in background
    ${process}=    Start Process    npm    run    dev    
    ...    cwd=${project_root}    
    ...    shell=True    
    ...    alias=frontend_server
    
    Set Test Variable    ${FRONTEND_PROCESS}    ${process}
    Log    Frontend server started with process ID: ${process.pid}

Wait For Frontend Application To Be Ready
    [Documentation]    Waits for the frontend app to be accessible on port 3001
    Log    Waiting for frontend application to be ready on ${FRONTEND_URL}...
    
    # Create a session for frontend health checks
    Create Session    frontend_session    ${FRONTEND_URL}    verify=False
    
    # Wait for the frontend application to respond
    FOR    ${attempt}    IN RANGE    1    31
        ${status}=    Run Keyword And Return Status    
        ...    GET On Session    frontend_session    /    expected_status=200
        
        Run Keyword If    ${status}    
        ...    Log    Frontend application is ready after ${attempt} attempts
        
        Exit For Loop If    ${status}
        
        Log    Attempt ${attempt}: Frontend not ready yet, waiting 1 second...
        Sleep    1s
    END
    
    Run Keyword Unless    ${status}    
    ...    Fail    Frontend application failed to start within ${TIMEOUT}

Open Frontend Application In Browser
    [Documentation]    Opens the frontend application in a new browser instance
    Log    Opening frontend application in ${BROWSER_TYPE} browser...
    
    # Create new browser context
    New Browser    ${BROWSER_TYPE}    headless=False
    New Context    viewport={'width': 1920, 'height': 1080}
    
    # Navigate to the frontend application
    ${page}=    New Page    ${FRONTEND_URL}
    Set Test Variable    ${PAGE}    ${page}
    
    Log    Browser opened and navigated to ${FRONTEND_URL}

Verify Frontend Application Is Running
    [Documentation]    Verifies the frontend React application loaded correctly
    Log    Verifying frontend application is running correctly...
    
    # Wait for the page to load completely
    Wait For Load State    networkidle    timeout=${TIMEOUT}
    
    # Verify page title or specific elements
    ${title}=    Get Title
    Log    Frontend page title: ${title}
    
    # Take a screenshot for verification
    Take Screenshot    frontend_startup_verification
    
    Log    ✅ Frontend application verification completed successfully!