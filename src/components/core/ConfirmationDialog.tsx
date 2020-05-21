import React, { Component } from 'react';
import { StyleClass, css } from '../../utils/Style';
import { Classes, Button } from '@blueprintjs/core';

interface IConfirmationDialogProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmIntent?: 'none' | 'primary' | 'success' | 'warning' | 'danger';
  onConfirmClick: () => void;
  onCancelClick?: () => void;
}

const dialogStyle = new StyleClass(css`
  padding: 1em;
  padding-top: 0.1em;
`);
const cancelButtonStyle = new StyleClass(css`
  margin-right: 0.5em;
`);

class ConfirmationDialog extends Component<IConfirmationDialogProps> {
  public constructor(props: Readonly<IConfirmationDialogProps>) {
    super(props);

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  public render() {
    return (
      <div className={dialogStyle.className}>
        <h4>{this.props.title || 'Please confirm'}</h4>
        <div>
          <Button
            className={`${cancelButtonStyle.className} ${Classes.POPOVER_DISMISS}`}
            onClick={this.handleCancelClick}
          >
            {this.props.cancelText || 'Cancel'}
          </Button>
          <Button
            className={Classes.POPOVER_DISMISS}
            intent={this.props.confirmIntent || 'danger'}
            onClick={this.handleConfirmClick}
          >
            {this.props.confirmText || 'Confirm'}
          </Button>
        </div>
      </div>
    );
  }

  private handleConfirmClick() {
    if (this.props.onConfirmClick) {
      this.props.onConfirmClick();
    }
  }

  private handleCancelClick() {
    if (this.props.onCancelClick) {
      this.props.onCancelClick();
    }
  }
}

export default ConfirmationDialog;
