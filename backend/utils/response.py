def errorResponse(message, actionCode="A0"):
    return dict(success=False, message=message, code=str(actionCode))


def successResponse(payload=dict()):
    return dict(success=True, data=payload)
